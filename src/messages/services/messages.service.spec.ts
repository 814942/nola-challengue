import { MessagesService } from './messages.service';
import { MessagesHandler } from '../helpers/messages.handler';

describe('MessagesService', () => {
  let service: MessagesService;
  let handler: MessagesHandler;

  beforeEach(() => {
    handler = {
      publishMessage: jest.fn().mockResolvedValue(undefined),
    } as any;
    service = new MessagesService(handler);
  });

  it('debería crear y publicar un mensaje', async () => {
    const userId = 1;
    const message = 'Hola mundo';

    const result = await service.createMessage(userId, message);

    expect(result).toMatchObject({ userId, message });
    expect(handler.publishMessage).toHaveBeenCalledWith(expect.objectContaining({ userId, message }));
    expect(service.getMessages()).toContainEqual(expect.objectContaining({ userId, message }));
  });
});