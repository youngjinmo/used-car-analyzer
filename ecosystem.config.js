module.exports = {
    apps: [
        {
            name: 'checkthiscar-server',
            cwd: './',
            script: 'server/dist/app.js',
            env_file: 'server/.env',
            env: {
                NODE_ENV: 'production',
            }
        }
    ]
}
