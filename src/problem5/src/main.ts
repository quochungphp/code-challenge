import 'reflect-metadata';
import { BootstrapApp } from './boostrap-app';
const app = new BootstrapApp();
(async () => {
    (await app.setup()).init();
})();
