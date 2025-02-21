document.addEventListener("DOMContentLoaded", () => {
    const loadingMessage = document.getElementById("loadingMessage");

    fetch('films_ready.json') // Replace with the path to your JSON file
        .then(response => response.json()) // Parse the JSON data
        .then(data => {
            loadTableData(data);
            loadingMessage.style.display = "none";

            // Initialize filters
            const filterInputs = document.querySelectorAll(".filter-input");
            const tableBody = document.querySelector("#dataTable tbody");
            const sortableHeaders = document.querySelectorAll("th.sortable");

            // Function to filter the table
            function filterTable() {
                const rows = Array.from(tableBody.querySelectorAll("tr"));
                rows.forEach(row => {
                    let shouldShow = true;

                    filterInputs.forEach((input, index) => {
                        const cellText = row.cells[index].textContent.toLowerCase();
                        const filterValue = input.value.toLowerCase();

                        if (!cellText.includes(filterValue)) {
                            shouldShow = false;
                        }
                    });

                    row.style.display = shouldShow ? "" : "none";
                });
            }

            // Attach event listeners to filter inputs
            filterInputs.forEach(input => {
                input.addEventListener("input", filterTable);
            });

            // Function to sort the table
            function sortTable(columnIndex, ascending) {
                const rows = Array.from(tableBody.querySelectorAll("tr"));

                rows.sort((rowA, rowB) => {
                    const cellA = rowA.cells[columnIndex].textContent.trim();
                    const cellB = rowB.cells[columnIndex].textContent.trim();

                    // Convert numeric values to numbers for proper comparison
                    const isNumeric = !isNaN(cellA) && !isNaN(cellB);
                    if (isNumeric) {
                        return ascending ? cellA - cellB : cellB - cellA;
                    }

                    // Compare strings case-insensitively
                    return ascending
                        ? cellA.localeCompare(cellB, undefined, { sensitivity: 'base' })
                        : cellB.localeCompare(cellA, undefined, { sensitivity: 'base' });
                });

                // Clear and re-append rows to reflect the new order
                rows.forEach(row => tableBody.appendChild(row));
            }

            // Track the sort state for each column
            const sortStates = Array(sortableHeaders.length).fill(true); // true = ascending, false = descending

            // Attach event listeners to sortable headers
            sortableHeaders.forEach((header, index) => {
                header.addEventListener("click", () => {
                    const ascending = sortStates[index];
                    sortTable(index, ascending);

                    // Add or remove sort classes
                    sortableHeaders.forEach(h => h.classList.remove("sorted-asc", "sorted-desc"));
                    header.classList.add(ascending ? "sorted-desc" : "sorted-asc");

                    // Toggle the sort state for the clicked column
                    sortStates[index] = !ascending;

                    // Reset sort states for other columns
                    sortStates.forEach((state, i) => {
                        if (i !== index) sortStates[i] = true;
                    });

                    // Reapply filters after sorting
                    filterTable();
                });
            });
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
            loadingMessage.textContent = "Failed to load data. Please try again later.";
        });
});

function loadTableData(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        const noDataRow = document.createElement("tr");
        const noDataCell = document.createElement("td");
        noDataCell.colSpan = 5; // Span all columns
        noDataCell.textContent = "No data available.";
        noDataCell.style.textAlign = "center";
        noDataRow.appendChild(noDataCell);
        tableBody.appendChild(noDataRow);
        return;
    }

    data.forEach(item => {
        const row = document.createElement("tr");
        const cell1 = document.createElement("td");
        cell1.textContent = item.title;
        row.appendChild(cell1);

        const cell2 = document.createElement("td");
        cell2.textContent = item.release_year;
        row.appendChild(cell2);

        const cell3 = document.createElement("td");
        cell3.textContent = item.director;
        row.appendChild(cell3);

        const cell4 = document.createElement("td");
        cell4.textContent = item.box_office.toFixed(3);
        row.appendChild(cell4);

        const cell5 = document.createElement("td");
        cell5.textContent = item.country;
        row.appendChild(cell5);

        tableBody.appendChild(row);
    });
}        