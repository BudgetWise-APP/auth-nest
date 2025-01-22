import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { CreateUserDto } from "src/auth/dto/create-user.dto";

@Injectable()
export class ElasticSearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async logUserCreate(user: CreateUserDto) {
   try {
    console.log('user', user)
    await this.elasticsearchService.index({
        index: "user-logs",
        body: {
            event: "USER_CREATED",
            userName: user.name,
            userEmail: user.email,
        }
    })
   }
    catch (e) {
         console.error(`Error logging user creation: ${e.message}`)
    }
  }

  async logUserLogin(user: CreateUserDto) {
    await this.elasticsearchService.index({
        index: "user-logs",
        body: {
            event: "USER_LOGGED_IN",
            userName: user.name,
            userEmail: user.email,
        }
    })
  }

  async logAuthError(email: string) {
    await this.elasticsearchService.index({
        index: "user-logs",
        body: {
            event: "AUTH_ERROR",
            userEmail: email,
        }
    })
}}