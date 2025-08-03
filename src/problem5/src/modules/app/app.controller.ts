import { inject } from 'inversify';
import {
    controller,
    httpGet,
    BaseHttpController,
    HttpResponseMessage,
    StringContent,
} from 'inversify-express-utils';
import { ConfigEnv } from '../../config/config.env';
import { TYPES } from '../../bootstrap-type';
/**
 * @swagger
 * tags:
 *   name: App
 *   description: App Controller
 */
@controller('/')
export class AppController extends BaseHttpController {
    constructor(@inject(TYPES.ConfigEnv) private configEnv: ConfigEnv) {
        super();
    }
    /**
     * @swagger
     * /:
     *   get:
     *     summary: Get app information
     *     tags: [App]
     *     responses:
     *       200:
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     */
    @httpGet('')
    public async get() {
        const response = new HttpResponseMessage(200);
        response.content = new StringContent('ok');
        return response;
    }
}
