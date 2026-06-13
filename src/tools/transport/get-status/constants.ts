export const GET_TRANSPORT_STATUS_DESCRIPTION = [
    'Get the live status of one transport by its jobId: lifecycle status, interpolated position, hops traveled,',
    'and ETA / arrival. Public — works for any jobId. This is the only source of a shipment live progress; the',
    'world map never carries shipments. As a secondary signal, a delivered shipment also bumps the target cell',
    'resource balance (visible via get_cell / get_changes).',
].join(' ');
