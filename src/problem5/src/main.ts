import 'reflect-metadata';
import { BootstrapApp } from './bootstrap-app';
const app = new BootstrapApp();
(async () => {
    (await app.setup()).init();
})();
