export namespace LeadsTypes {
    export type leadData = {
        id: number,
        name: string,
        price: number,
        responsible_user_id: number,
        status_id: number,
        created_at: number
    };

    export interface leadsData {
        _embedded: Record<'leads', leadData[]>
    }
}

export namespace ContactTypes {
    export type apiContactData = {
        id: number,
        name: string,
        custom_fields_values: {
            values: [
                {
                    value: string
                }
            ]
        }[],
        _embedded: {
            leads: {
                id: number
            }[]
        }
    };

    export type apiContactLinks = {
        _embedded: {
            links: {
                // контакт
                to_entity_id: number,
                to_entity_type: string
            }[]
        }
    }

    export interface apiContactsData {
        _embedded: Record<'contacts', apiContactData[]>
    }

    export type contactData = { name: string, phone: string, email: string }
}

export namespace UsersTypes {
    export type userData = {
        id: number,
        name: string,
        email?: string
    };
    export interface usersData {
        _embedded: Record<'users', userData[]>
    }

    export type transformedData  = {
        [key: string] : {
            name: string,
            email?: string
        }
    };
}

export namespace StatusesTypes {
    export type statusData = {
        id: number,
        name: string,
    };

    export type transformedStatusData = {
        [key: string] : {
            name: string,
        }
    };
    export interface statusesData {
        _embedded: Record<'statuses', statusData[]>
    }

    export interface pipelinesData {
        _embedded: {
            pipelines: Array<statusesData>
        }
    }
}

export namespace ApiTypes {
    export interface TokenData {
        token_type: string,
        expires_in: number,
        access_token: string,
        refresh_token: string
    }

    export type leadData = {
        id: number,
        name: string,
        price: number,
        responsible_user_id: number,
        status_id: number,
        created_at: number
    };

    export interface leadsData {
        _embedded: Record<'leads', leadData[]>
    }

    export interface ApiI {
        _call: (...args: any) => Promise<any>
    }
}