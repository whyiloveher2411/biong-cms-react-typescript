import { ajax } from 'hook/useApi';

export interface Settings {

}

const settingService = {

    getAll: async (): Promise<Settings> => {
        let data = await ajax({
            url: 'settings/all',
        });

        return data;
    },
    getLoginConfig: async (): Promise<any> => {
        let data = await ajax({
            url: 'login/settings',
        });
        return data;
    }

}

export default settingService;