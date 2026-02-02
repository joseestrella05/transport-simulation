import { CONFIG } from '../../core/config';

export class Pasajero {
    constructor(id, origen) {
        this.id = id;
        this.dinero = Math.random() < CONFIG.PROBABILIDAD_DINERO
            ? Math.random() * 150 + 50
            : Math.random() * 49;
        this.origen = origen;
    }

    puedePagar() {
        return this.dinero >= CONFIG.COSTO_TICKET;
    }
}
