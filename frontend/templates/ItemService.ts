import { inject, singleton } from 'tsyringe';
import type { AxiosInstance } from 'axios';
import { defaultHttpClientInjectionToken } from '@/config/AxiosHttpClient';
import { BaseService } from '@core/services/BaseService';
import { DefaultSelectItem } from '@models/shared/DefaultSelectItem';
import { ItemRequest } from '@models/item/ItemRequest';

@singleton()
export class ItemService extends BaseService {
    constructor(@inject(defaultHttpClientInjectionToken) protected http: AxiosInstance) {
        super('/Item', http);
    }

    async persist(request: ItemRequest): Promise<void> {
        if (request.uuid) await this.update(request.uuid, request);
        else await this.create(request);
    }

    async selectItems(): Promise<DefaultSelectItem[]> {
        const { data } = await this.http.get<DefaultSelectItem[]>(`${this.api}/select-items`);
        return data;
    }
}
