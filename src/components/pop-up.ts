import { createThing } from 'custom-card-helpers';

import { getPopupConfigs, getLovelace } from '../util';

const cleanup = () => {
    // document.querySelector('home-assistant')!.removeEventListener('hass-more-info');
};

const init = () => {
    const lovelace = getLovelace();
    const config = lovelace.config;

    const configs = getPopupConfigs(config.views);
    const handler = getHandler(configs);

    document
        .querySelector('home-assistant')!
        .addEventListener('hass-more-info', handler);
};

const getHandler = (configs: object) => {
    const entities = Object.keys(configs);

    return e => {
        const moreInfoEl =
            // @ts-ignore
            document.querySelector('home-assistant')?._moreInfoEl;

        // @ts-ignore
        if (!e.detail || !e.detail.entityId) {
            moreInfoEl.shadowRoot.querySelector('google-home-detail')?.remove();
            return;
        }

        if (!entities.includes(e.detail.entityId)) return;

        const entity = e.detail.entityId;
        const config = configs[entity];
        const card = createThing({
            type: 'custom:google-home-detail',
            entity,
            ...config,
        });

        moreInfoEl._page = 'none';
        moreInfoEl.shadowRoot.appendChild(card);
    };
};

init();
