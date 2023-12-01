// 获取当前命令行 后面的参数
import * as path from 'path'
import {join} from 'path'
import * as fs from 'fs-extra'
import * as fs2 from 'fs'
import * as COS from 'cos-nodejs-sdk-v5';

export interface MinioInfo {
    region: string;
    secretId: string;
    secretKey: string;
    bucket: string;
    url?: string;
    enableLog?: boolean;
    srcPath?: string;
    prefix?: string;
    exclude?: string|RegExp;
}
export class Tool {

    options: MinioInfo;
    cos: COS;

    constructor(options: MinioInfo) {
        this.options = options;
        if (this.options.url) this.options.url = this.options.url.replace(/\/$/, '')
        this.cos = new COS({
            SecretId: this.options.secretId,
            SecretKey: this.options.secretKey, // 密钥key
        });
    }

    async start() {
        const {srcPath} = this.options
        let folder
        if (srcPath && (srcPath.indexOf(':/') != -1 || srcPath.indexOf(':\\') != -1)) {
            folder = srcPath
        } else {
            folder = join(process.cwd(), srcPath || '')
        }
        let outputPath = folder

        this.log('---UPLOAD START---')
        let list = this.browserFiles(outputPath)
        if (this.options.exclude) {
            this.options.exclude = new RegExp(this.options.exclude)
            // @ts-ignore
            list = list.filter((vo) => this.options.exclude.test(vo))
        }
        let prefix = this.options.prefix || ''
        try {
            for (let i = 0; i < list.length; i++) {
                const filePath = list[i];
                const key = path.join(prefix, filePath.slice(outputPath.length)).replace(/\\/g, '/')
                this.log(i, key, filePath)
                //获取文件信息
                const putObjectResult = await new Promise((resolve, reject) => {
                    this.cos.putObject(
                        {
                            Bucket: this.options.bucket,
                            Region: this.options.region,
                            Key: key,
                            Body: fs2.readFileSync(filePath),
                        },
                        function (err, data) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(data);
                        },
                    );
                    /*await this.cosRun.putObject(this.options.bucket, key, fs2.readFileSync(filePath), {
                        'Content-Type': mime.getType(filePath),
                    })*/
                })
            }
        }catch (e) {
            console.log('上传报错',e)
        }

        this.log(`---UPLOAD END---`)
    }

    log(...rest) {
        if (this.options.enableLog) {
            console.log.apply(this, rest)
        }
    }

    browserFiles(folder: string, list?: string[]): string[] {
        list = list || []
        fs.readdirSync(folder).forEach(file => {
            let filePath = path.join(folder, file)
            let stat = fs.statSync(filePath)
            if (stat.isDirectory()) {
                this.browserFiles(filePath, list)
            } else if (file !== '.DS_Store' && file !== 'Thumbs.db') {
                list.push(filePath)
            }
        })
        return list
    }
}
