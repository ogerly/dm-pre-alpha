import { execSync } from 'child_process';
import fs from 'fs';

// Ensure we're in production mode
process.env.NODE_ENV = 'production';

const REPO_URL = 'https://github.com/ogerly/dm-pre-alpha.git';
const REPO_NAME = 'dm-pre-alpha';

try {
  // Build the app
  console.log('Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Create .nojekyll file to prevent Jekyll processing
  console.log('Creating .nojekyll file...');
  fs.writeFileSync('./dist/.nojekyll', '');

  console.log('Build completed successfully!');
  console.log('\nTo deploy manually to GitHub Pages:');
  console.log(`1. git remote add gh-pages ${REPO_URL} # (if not already added)`);
  console.log('2. git add dist -f');
  console.log(`3. git commit -m "Deploy to ${REPO_NAME} GitHub Pages"`);
  console.log(`4. git subtree push --prefix dist gh-pages gh-pages`);
} catch (error) {
  console.error('Error during build:', error);
  process.exit(1);
}
