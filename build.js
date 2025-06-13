const { execSync } = require('child_process');
const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

const commands = [
  `npx electron-packager . ColorBJ-${version} --platform=linux --arch=x64 --icon=niepaint.png`,
  `npx electron-packager . ColorBJ-${version} --platform=win32 --arch=x64 --icon=niepaint.ico`,
  `npx electron-packager . ColorBJ-${version} --platform=darwin --arch=x64 --icon=ColorBJ.icns`
];

commands.forEach(cmd => {
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
});
