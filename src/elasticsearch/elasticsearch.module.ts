import {Module} from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticSearchService } from './elasticsearch.service';

@Module({
    imports:[
        ElasticsearchModule.register({
            node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
            auth: {
                username: process.env.ELASTICSEARCH_USERNAME || "elastic",
                password: process.env.ELASTICSEARCH_PASSWORD || "password"
            },
            ssl: {
                rejectUnauthorized: false
            },
        })
    ],
    providers: [ElasticSearchService],
    exports: [ElasticSearchService]
})

export class ElasticModule {}