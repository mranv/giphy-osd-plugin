import { PluginInitializerContext } from '../../../src/core/server';
import { MranvPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new MranvPlugin(initializerContext);
}

export { MranvPluginSetup, MranvPluginStart } from './types';
