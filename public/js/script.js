// Función para mostrar la ventana emergente de confirmación de reserva
function reservar() {
    document.getElementById('confirmacionReserva').style.display = 'flex';
}

// Función para mostrar la ventana emergente de cancelación de reserva
function cancelarReserva() {
    document.getElementById('cancelacionReserva').style.display = 'flex';
}

// Función para cerrar una ventana emergente específica
function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
