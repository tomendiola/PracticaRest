/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


async function obtenerTerremotos() {
    // Obtener valores de los campos
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const minMagnitude = document.getElementById("minMagnitude").value;
    const resultsDiv = document.getElementById("results");

    // Validar que las fechas estén completas
    if (!startDate || !endDate) {
        resultsDiv.innerHTML = "<p>Por favor, ingrese fechas válidas.</p>";
        return;
    }

    // Limpiar resultados anteriores
    resultsDiv.innerHTML = "<p>Cargando...</p>";

    // Construir la URL de la API
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&minmagnitude=${minMagnitude}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        
        const data = await response.json();
        const terremotos = data.features;

        // Mostrar resultados
        if (terremotos.length > 0) {
            resultsDiv.innerHTML = `<p>Total de terremotos encontrados: ${terremotos.length}</p>`;
            terremotos.forEach(terremoto => {
                const lugar = terremoto.properties.place;
                const magnitud = terremoto.properties.mag;
                const tiempo = new Date(terremoto.properties.time);

                // Crear elemento HTML para cada terremoto
                const terremotoDiv = document.createElement("div");
                terremotoDiv.classList.add("terremoto");
                terremotoDiv.innerHTML = `
                    <p><strong>Lugar:</strong> ${lugar}</p>
                    <p><strong>Magnitud:</strong> ${magnitud}</p>
                    <p><strong>Fecha:</strong> ${tiempo.toLocaleString()}</p>
                `;
                resultsDiv.appendChild(terremotoDiv);
            });
        } else {
            resultsDiv.innerHTML = "<p>No se encontraron terremotos en el rango de fechas seleccionado.</p>";
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error en la consulta: ${error.message}</p>`;
    }
}