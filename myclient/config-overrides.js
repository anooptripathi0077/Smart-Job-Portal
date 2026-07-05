export default function override(config) {
  config.devServer = config.devServer || {};
  config.devServer.allowedHosts = "all";
  return config;
}
