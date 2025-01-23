import {Module} from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticSearchService } from './elasticsearch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports:[
        ElasticsearchModule.register({
            node: process.env.ELASTICSEARCH_NODE
        })
    ],
    providers: [ElasticSearchService],
    exports: [ElasticSearchService]
})

export class ElasticModule {}