const sampleDevices = [
  { name: "Cold Room Sensor 04", id: "SNS-0482", reading: "6.8", unit: "°C", status: "Online", seen: "Just now", icon: "⌁" },
  { name: "Greenhouse Humidity", id: "SNS-0317", reading: "68.2", unit: "%", status: "Online", seen: "12 sec ago", icon: "◉" },
  { name: "Water Pump 02", id: "ACT-0209", reading: "14.6", unit: "L/min", status: "Warning", seen: "28 sec ago", icon: "⟳" },
  { name: "Ambient Pressure 01", id: "SNS-0104", reading: "101.3", unit: "kPa", status: "Offline", seen: "18 min ago", icon: "◌" },
];

const chartSets = {
  temperature: {
    label: "Temperature", min: 16, max: 32, ticks: ["32°", "28°", "24°", "20°", "16°"],
    values: { "1H": [21, 22, 20, 23, 24, 22, 25], "6H": [20, 22, 21, 25, 23, 26, 24, 27, 25, 28, 26, 29, 27], "24H": [18, 19, 21, 20, 22, 24, 23, 21, 25, 27, 24, 28, 26] },
  },
  humidity: {
    label: "Humidity", min: 30, max: 90, ticks: ["90%", "75%", "60%", "45%", "30%"],
    values: { "1H": [53, 55, 52, 59, 57, 61, 58], "6H": [44, 49, 47, 53, 50, 58, 55, 63, 59, 68, 65, 72, 68], "24H": [38, 42, 48, 45, 52, 57, 54, 50, 60, 66, 61, 74, 69] },
  },
  pressure: {
    label: "Pressure", min: 100, max: 102, ticks: ["102.0", "101.5", "101.0", "100.5", "100.0"],
    values: { "1H": [101.1, 101.2, 101.25, 101.18, 101.3, 101.28, 101.4], "6H": [100.8, 101, 100.95, 101.1, 101.05, 101.22, 101.18, 101.3, 101.26, 101.42, 101.35, 101.5, 101.4], "24H": [100.4, 100.55, 100.8, 100.7, 100.9, 101.05, 101.1, 100.95, 101.2, 101.35, 101.25, 101.55, 101.4] },
  },
};

let selectedRange = "6H";
let toastTimer;

function renderDevices(query = "") {
  const rows = document.querySelector("#device-rows");
  const matching = sampleDevices.filter((device) => `${device.name} ${device.id} ${device.status}`.toLowerCase().includes(query.toLowerCase()));
  rows.innerHTML = matching.map((device, index) => {
    const statusClass = device.status.toLowerCase();
    return `<tr>
      <td><div class="device-name"><span class="device-icon icon-${index + 1}">${device.icon}</span><span>${device.name}<small class="device-id">${device.id}</small></span></div></td>
      <td><span class="reading-value">${device.reading}</span> <span class="unit">${device.unit}</span></td>
      <td><span class="status-pill ${statusClass}"><span class="status-dot ${statusClass === "online" ? "green" : statusClass === "warning" ? "amber" : "gray"}"></span> ${device.status}</span></td>
      <td>${device.seen}</td>
    </tr>`;
  }).join("");
  document.querySelector("#device-count").textContent = matching.length;
  document.querySelector("#empty-state").hidden = matching.length > 0;
  rows.hidden = matching.length === 0;
}

function linePath(points) {
  return points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

function renderChart() {
  const metric = chartSets[document.querySelector("#metric-select").value];
  const values = metric.values[selectedRange];
  const min = metric.min;
  const max = metric.max;
  const width = 840;
  const height = 204;
  const points = values.map((value, index) => [index * width / (values.length - 1), 12 + (max - value) / (max - min) * (height - 12)]);
  const path = linePath(points);
  document.querySelector("#chart-line").setAttribute("d", path);
  document.querySelector("#chart-area-fill").setAttribute("d", `${path} L ${width} ${height} L 0 ${height} Z`);
  document.querySelector("#chart-points").innerHTML = points.map(([x, y], index) => index === points.length - 1 ? `<circle class="chart-point" cx="${x}" cy="${y}" r="4.5"/>` : "").join("");
  document.querySelector("#chart-legend-label").textContent = metric.label;
  document.querySelector("#y-axis").innerHTML = metric.ticks.map((tick) => `<span>${tick}</span>`).join("");
  const intervals = selectedRange === "1H" ? ["13:00", "13:10", "13:20", "13:30", "13:40", "13:50", "14:00"]
    : selectedRange === "24H" ? ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"]
    : ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];
  document.querySelector("#x-axis").innerHTML = intervals.map((label) => `<span>${label}</span>`).join("");
  document.querySelector("#telemetry-chart").setAttribute("aria-label", `Illustrative ${metric.label.toLowerCase()} readings for ${selectedRange}`);
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

document.querySelector("#device-search").addEventListener("input", (event) => renderDevices(event.target.value.trim()));
document.querySelector("#metric-select").addEventListener("change", renderChart);
document.querySelectorAll(".range-button").forEach((button) => {
  button.addEventListener("click", () => {
    selectedRange = button.dataset.range;
    document.querySelectorAll(".range-button").forEach((item) => item.classList.toggle("is-selected", item === button));
    renderChart();
  });
});
document.querySelector("#add-device").addEventListener("click", () => showToast("Device connection will be added after the integration requirements are confirmed."));
document.querySelector("#add-rule").addEventListener("click", () => showToast("Rule management is a preview. Rule behavior is awaiting project requirements."));
document.querySelector("#device-filter").addEventListener("click", () => showToast("Status filtering is not connected in this prototype."));
document.querySelector(".notice-close").addEventListener("click", () => document.querySelector(".demo-notice").remove());

renderDevices();
renderChart();
