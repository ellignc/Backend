const UniqueIDData = {
    type: 'string',
    description: 'A unique identifier',
    value: '1325cff1-8f82-46f6-843a-ceaf6d571248',
    example: '1325cff1-8f82-46f6-843a-ceaf6d571248'
};

const JWTData = {
    type: 'string',
    description: 'A JSON Web Token',
    value: '1325cff1-8f82-46f6-843a-ceaf6d571248',
    example: '1325cff1-8f82-46f6-843a-ceaf6d571248'
};

const UsernameData = {
    type: 'string',
    description: 'A unique username',
    value: 'ellignc',
    example: 'ellignc'
}

const PasswordData = {
    type: 'string',
    description: 'Password string',
    value: 'password12345',
    example: 'password12345'
}

const TextData = {
    type: 'string',
    description: 'Any textual string',
    value: 'Hello World!',
    example: 'Hello World!'
};

const DoneData = {
    type: 'boolean',
    description: 'If a todo object is tagged as done',
    value: true,
    example: true
};

const DateData = {
    type: 'number',
    description: 'A date value that is in Unix Epoch',
    value: 1598678462382,
    example: 1598678462382,
};

const SuccessData = {
    type: 'boolean',
    description: 'State of a response',
    value: true,
    example: true
};

const LimitData = {
    type: 'number',
    description: 'Limit of how many items we should query',
    value: 4,
    example: 4
};

const SuccessResponse = {
    type: 'object',
    description: 'Response with a success state only',
    properties: {
        success: SuccessData
    }
};

const TodoFullData = {
    type: 'object',
    description: 'Todo object data coming from the database',
    properties: {
        id: UniqueIDData,
        text: TextData,
        done: DoneData,
        dateUpdated: DateData,
        dateCreated: DateData
    }
};

const TodoListData = {
    type: 'array',
    description: 'A list of todos',
    items: TodoFullData   
}

const GetManyTodoQuery = {
    type: 'object',
    description: 'Query parameters for getting many todos',
    properties: {
        limit: LimitData,
        startDate: DateData,
        endDate: DateData
    }
}

const GetOneTodoParams = {
    type: 'object',
    description: 'Parameters for getting one todo',
    properties: {
        id: UniqueIDData,
    }
}

const UserFullData = {
    type: 'object',
    description: 'User data for response without the password',
    properties: {
        username: UsernameData,
        dateUpdated: DateData,
        dateCreated: DateData
    }
}

const GetOneUserResponse = {
    type: 'object',
    description: 'Returns a user',
    required: ['success', 'data'],
    properties: {
        success: SuccessData,
        data: UserFullData
    }
}

const GetManyTodoResponse = {
    type: 'object',
    description: 'Returns a list of todos',
    required: ['success', 'data'],
    properties: {
        success: SuccessData,
        data: TodoListData
    }
}

const PostUserRequest = {
    type: 'object',
    description: 'User object data for creation',
    required: [
        'username',
        'password'
    ],
    properties: {
        username: UsernameData,
        password: PasswordData,
    }
}

const PostTodoRequest = {
    type: 'object',
    description: 'Todo object data for update',
    required: [
        'text'
    ],
    properties: {
        text: TextData,
        done: DoneData,
    }
}

const PutTodoRequest = {
    type: 'object',
    description: 'Todo object data coming from the database',
    properties: {
        text: TextData,
        done: DoneData,
    }
}

const GetOneTodoResponse = {
    type: 'object',
    description: 'Returns a todo',
    required: ['success', 'data'],
    properties: {
        success: SuccessData,
        data: TodoFullData
    }
}

const LoginResponse = {
    type: 'object',
    description: 'Returns a JWT data',
    required: ['success', 'data'],
    properties: {
        success: SuccessData,
        data: JWTData
    }
}

exports.definitions = {
    SuccessResponse,
    GetManyTodoResponse,
    GetManyTodoQuery,
    GetOneTodoParams,
    GetOneTodoResponse,
    PostTodoRequest,
    PutTodoRequest,
    PostUserRequest,
    GetOneUserResponse,
    LoginResponse
}