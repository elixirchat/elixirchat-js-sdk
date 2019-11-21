console.log('Type:', typeof process.env.npm_config_argv);
console.log('Value:', process.env.npm_config_argv);
console.log('Original npm args:', JSON.parse(process.env.npm_config_argv).original);

throw new Error("aborting");
