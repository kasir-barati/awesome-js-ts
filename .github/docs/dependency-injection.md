# Dependency inversion principle

- Higher level components/modules should not depend on lower level components/modules. Instead they should rely on abstraction (interfaces).
- Abstractions should not depend on details. Details should depend on abstractions.
- High-level components/modules should be easily reusable and unaffected by changes in low-level components/modules (achieved through interfaces, abstraction).
  - High-level components/modules provide complex logic.
  - Low-level components/modules provide utility features.
- In other word we are decoupling the high-level & low-level components/modules from each other.

# Inversion of Control (IoC)

- A **design principle**.
- We are giving up some control & responsibility over our app to a framework/system.
  - Control refers to any additional responsibilities a class has, other than its main responsibility.
  - E.g. control over:
    - the flow of an application.
    - the flow of an object creation.
    - dependent object creation and binding.
- Instead of coding everything and providing everything by ourselves we are relying for example on a framework such as NestJS.

  ```ts
  class UserRepository {
    constructor(private readonly loggerService: LoggerService) {}
  }
  ```

  In the previous code instead of dealing with `LoggerService` instantiation we are delegating it to the NestJS framework. So when our app is up and running it has the `loggerService` instance available.

- First step towards achieving loose coupled design.
- In layman's terms, suppose you drive a car to your work place. This means you control the car. The IoC principle suggests to invert the control, meaning that instead of driving the car yourself, you hire a cab, where another person will drive the car. Thus, this is called inversion of the control - from you to the cab driver. You don't have to drive a car yourself and you can let the driver do the driving so that you can focus on your main work.

# Dependency injection (DI)

- A **design pattern** for achieving Inversion of Control (IoC).
- How are we going to set and assign values to our dependencies.

  ```ts
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { User } from './entities/user.entity';
  @Injectable()
  class UserRepository {
    constructor(
      @InjectModel(User.name)
      private readonly userModel: Model<User>,
    ) {}
  }
  ```

  - A dependency is an object that another object depends on.
  - In this example we are injecting user model in our user repository.
  - Note that we are also introducing user repository as injectable so that other services could simply inject it like this:

    ```ts
    @Injectable()
    class UserService {
      constructor(private readonly userRepository: UserRepository) {}
    }
    ```

  - You can see how [inversion of control](#inversion-of-control-ioc) is implemented by DI. We are relying on NestJS to create objects for us.

- Separating the concern of constructing objects and using them.
- Loosely coupled programs.

# Refs

- [Inversion of Control](https://www.tutorialsteacher.com/ioc/inversion-of-control).
