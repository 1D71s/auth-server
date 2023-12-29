import { Resolver } from '@nestjs/graphql';
import { AttemptService } from './attempt.service';

@Resolver()
export class AttemptResolver {
  constructor(private readonly attemptService: AttemptService) {}
}
