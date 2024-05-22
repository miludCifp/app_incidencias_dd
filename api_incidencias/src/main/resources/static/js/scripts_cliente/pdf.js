async function generarPDFParteTb(parteJSON, token) {
    // Decodificar el JSON serializado de parte
    const parte = JSON.parse(decodeURIComponent(parteJSON));

    // Obtener el idOrden de la parte
    const idOrden = parte.idOrden;

    // Llamar a la función para generar y descargar el PDF
    await generarYDescargarPDF(idOrden, token, parte.incidencia.idIncidencia);
}

async function generarYDescargarPDF(idOrden, token, idIncidencia) {
    try {
        // Configurar los encabezados de la solicitud con el token
        const headers = {
            Authorization: `Bearer ${token}`
        };

        // Hacer la petición GET al endpoint del servidor para obtener el PDF
        const response = await fetch(`http://localhost:8080/api/v1/parte-trabajo/generar-pdf/${idOrden}`, {
            headers: headers
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            //throw new Error(`Error al obtener el PDF: ${response.statusText}`);
            Swal.fire({
                icon: 'danger',
                title: '¡Error al generar el archivo PDF!',
                text: 'Mensaje de error. '+response.statusText,
            });
        }

        Swal.fire({
            icon: 'success',
            title: '¡Archivo PDF generado correctamente!',
            text: 'El archivo se descargará en unos segundos',
        });

        // Convertir la respuesta a un ArrayBuffer
        const pdfData = await response.arrayBuffer();

        // Crear un nuevo objeto Blob con los datos del PDF
        const blob = new Blob([pdfData], { type: 'application/pdf' });

        // Crear un nuevo objeto URL para el blob
        const url = URL.createObjectURL(blob);

        // Crear un elemento <a> para descargar el PDF
        const link = document.createElement('a');
        link.href = url;
        link.download = 'documento_'+idIncidencia+'.pdf';

        // Simular un clic en el enlace para descargar el PDF
        link.click();

        // Liberar el objeto URL creado
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error al generar o descargar el PDF:', error);
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    // Función para hacer la petición al endpoint y manejar el PDF devuelto
   

    // Llamar a la función para generar y descargar el PDF
    //generarYDescargarPDF(1); // Reemplaza 123 con el ID de la orden que deseas procesar
});


// Llamar a la función para generar y descargar el PDF
//generarYDescargarPDF(1); // Reemplaza 123 con el ID de la orden que deseas procesar