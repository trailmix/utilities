export default {
  namespace: "TRAILMIX", // prefixed to all env vars
  vars: {
    consoleLevel:{
      command: 'base',
      global: true,
      description: "Explicitly set console log level",
      // object will be created as log.console.level
      env: 'LOG_CONSOLE_LEVEL' // namespace+ENV == TRAILMIX_LOG_CONSOLE_LEVEL
    }
  }
}
