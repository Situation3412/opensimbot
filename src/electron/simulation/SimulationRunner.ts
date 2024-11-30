import { spawn, type SpawnOptions } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { app } from 'electron';
import { SimulationError } from '../utils/errors';
import { logger } from '../utils/logger';

interface SimulationParams {
  input: string;
  iterations: number;
  threads: number;
}

interface SimulationResult {
  dps: number;
  error: string | null;
  rawOutput?: string;
}

export class SimulationRunner {
  constructor(private simcPath: string) {}

  async run(params: SimulationParams): Promise<SimulationResult> {
    const tempDir = app.getPath('temp');
    const inputFile = path.join(tempDir, `simc_input_${Date.now()}.simc`);
    const jsonFile = path.join(tempDir, `simc_output_${Date.now()}.json`);

    try {
      await this.writeInput(inputFile, params.input);
      const output = await this.runSimulation(inputFile, jsonFile, params);
      const result = await this.parseResults(jsonFile);

      return {
        dps: result.sim.players[0].collected_data.dps.mean,
        error: null,
        rawOutput: output
      };
    } catch (error) {
      throw new SimulationError(error instanceof Error ? error.message : String(error));
    } finally {
      await this.cleanup(inputFile, jsonFile);
    }
  }

  private async writeInput(inputFile: string, input: string): Promise<void> {
    const cleanedInput = input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .join('\n');

    await fs.writeFile(inputFile, cleanedInput, 'utf8');
  }

  private async runSimulation(inputFile: string, jsonFile: string, params: SimulationParams): Promise<string> {
    return new Promise((resolve, reject) => {
      const args = [
        `input=${inputFile}`,
        `iterations=${params.iterations}`,
        `threads=${params.threads}`,
        `json2=${jsonFile}`
      ];

      const options: SpawnOptions = {
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe']
      };

      const child = spawn(this.simcPath, args, options);
      let output = '';
      let errorOutput = '';

      if (child.stdout) {
        child.stdout.on('data', (data: Buffer) => {
          const chunk = data.toString();
          output += chunk;
        });
      }

      if (child.stderr) {
        child.stderr.on('data', (data: Buffer) => {
          const chunk = data.toString();
          errorOutput += chunk;
        });
      }

      child.on('error', (error: Error) => {
        reject(new SimulationError(`Failed to start simulation: ${error.message}`));
      });

      child.on('close', (code: number | null) => {
        if (code !== 0) {
          reject(new SimulationError(`Simulation failed with code ${code}: ${errorOutput}`));
        } else {
          resolve(output);
        }
      });
    });
  }

  private async parseResults(jsonFile: string): Promise<any> {
    const jsonOutput = await fs.readFile(jsonFile, 'utf8');
    return JSON.parse(jsonOutput);
  }

  private async cleanup(...files: string[]): Promise<void> {
    await Promise.all(files.map(file => 
      fs.unlink(file).catch(err => 
        logger.warn(`Failed to cleanup file ${file}:`, err)
      )
    ));
  }
} 