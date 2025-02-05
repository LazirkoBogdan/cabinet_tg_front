import { Signal } from 'micro-signals';

interface SignalMap {
    [key: string]: Signal<any>;
}

const signals: SignalMap = {};
const show = ['boolean', 'string', 'number'];

function getSignal(name: string): Signal<any> {
    return signals[name] = signals[name] || new Signal();
}

function onCustom(name: string, handler: (payload: any) => void, trigger: string, once: boolean): void {
    function wrap(payload: any) {
        if (String(payload) === trigger) {
            once && off(name, wrap);
            handler(payload);
        }
    }

    getSignal(name).add(wrap);
}

export const signal = {
    dispatch,
    off,
    on,
    once,
    promise,
};

function once(name: string, handler: (payload: any) => void): void {
    const [signal, custom] = name.split('|');
    if (custom) {
        onCustom(signal, handler, custom, true);
    } else {
        getSignal(signal).addOnce(handler);
    }
}

function on(name: string, handler: (payload: any) => void): void {
    const [signal, custom] = name.split('|');
    if (custom) {
        onCustom(signal, handler, custom, false);
    } else {
        getSignal(signal).add(handler);
    }
}

function promise(name: string): Promise<any> {
    return new Promise((resolve) => once(name, resolve));
}

function off(name: string, handler: (payload: any) => void): void {
    getSignal(name).remove(handler);
}

function dispatch(name: string, payload: any = {}): void {
    const details = show.includes(typeof payload) ? ` => ${payload}` : '';
    const [type] = name.split(':');

    getSignal(name).dispatch(payload);
}