const path = require('path');

module.exports = {
  packagerConfig: {
    icon: 'icon'
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'OpenSimBot'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    }
  ]
}; 