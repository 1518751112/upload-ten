import {Tool,MinioInfo} from "../src";
import * as yamljs from 'yamljs'
const [configFile] = process.argv.slice(2)
import {join} from 'path'

//配置文件
const options = yamljs.load(join(process.cwd(), configFile || 'uploadTen.yml')) as MinioInfo
const tool = new Tool(options)
tool.start()
