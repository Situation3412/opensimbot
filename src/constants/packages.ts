export interface LinuxPackage {
  name: string;
  description: string;
}

export type PackageManagerType = 'APT' | 'DNF' | 'YUM' | 'PACMAN' | 'ZYPPER';

export const REQUIRED_PACKAGES: Record<PackageManagerType, LinuxPackage[]> = {
  'APT': [
    { name: 'git', description: 'Version control system' },
    { name: 'make', description: 'Build automation tool' },
    { name: 'cmake', description: 'Cross-platform build system' },
    { name: 'g++', description: 'C++ compiler' },
    { name: 'libcurl4-openssl-dev', description: 'CURL development files' }
  ],
  'DNF': [
    { name: 'git', description: 'Version control system' },
    { name: 'make', description: 'Build automation tool' },
    { name: 'cmake', description: 'Cross-platform build system' },
    { name: 'gcc-c++', description: 'C++ compiler' },
    { name: 'libcurl-devel', description: 'CURL development files' }
  ],
  'YUM': [
    { name: 'git', description: 'Version control system' },
    { name: 'make', description: 'Build automation tool' },
    { name: 'cmake', description: 'Cross-platform build system' },
    { name: 'gcc-c++', description: 'C++ compiler' },
    { name: 'libcurl-devel', description: 'CURL development files' }
  ],
  'PACMAN': [
    { name: 'git', description: 'Version control system' },
    { name: 'make', description: 'Build automation tool' },
    { name: 'cmake', description: 'Cross-platform build system' },
    { name: 'gcc', description: 'C++ compiler' },
    { name: 'curl', description: 'CURL library' }
  ],
  'ZYPPER': [
    { name: 'git', description: 'Version control system' },
    { name: 'make', description: 'Build automation tool' },
    { name: 'cmake', description: 'Cross-platform build system' },
    { name: 'gcc-c++', description: 'C++ compiler' },
    { name: 'libcurl-devel', description: 'CURL development files' }
  ]
}; 