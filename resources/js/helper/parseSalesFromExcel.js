import * as XLSX from "xlsx";

export default function parseSalesFromExcel(data, projects) {
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const json = XLSX.utils.sheet_to_json(worksheet);

    const projectNames = json.map((item) => item.project);
    const uniqueProjectNames = [...new Set(projectNames)];
    const filteredProjects = projects.filter((project) => uniqueProjectNames.includes(project.name)).map((project) => ({
        id: project.id,
        name: project.name,
    }));

    const salesData = json.map((item) => {
        const project = filteredProjects.find((project) => project.name === item.project);
            return {
                project: project ? project.id : "",
                date: item.date,
                quantity: item.quantity,
            };
        }
    ).filter((item) => item.project !== "");

    return salesData;
}