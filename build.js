const { execSync } = require('child_process');
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;
const commands = [
  `electron-packager . ColorBJ-${version} --platform=linux --arch=x64 --icon=niepaint.png`,
  `electron-packager . ColorBJ-${version} --platform=win32 --arch=x64 --icon=niepaint.ico`
];
commands.forEach(cmd => {
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
});
