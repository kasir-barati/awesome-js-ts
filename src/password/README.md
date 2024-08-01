# How you can use `First options`:

I chain them to send meaningful messages to the user.

```ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

const specialCharRegex = /(?=.*[!@#$&*])/;

export class LoginWithUsernameDto {
  @ApiProperty({
    required: true,
    isArray: false,
    description: 'This field represents username',
    example: 'kasir.barati@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    required: true,
    isArray: false,
    description: `Password should be at least 8 character, contains ${specialCharRegex}, and be a combination of numbers and words`,
    example: '123aBBc@#!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(specialCharRegex, {
    message: `password should contains: ${specialCharRegex}`,
  })
  @Matches(/(?=.*[a-z].*[a-z])/, {
    message: 'Password should have at least two lower letter',
  })
  @Matches(/(?=.*[A-Z].*[A-Z])/, {
    message: 'Password should have at least two upper letter',
  })
  @Matches(/(?=.*[0-9].*[0-9])/, {
    message: 'Password should have at least two number',
  })
  password: string;
}
```
