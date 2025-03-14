module.exports = {
    // Skills selector helper
    seleccionarDevSkills : (seleccionadas=[], opciones) => {
        const skills = [
            // Habilidades técnicas
            "JavaScript",
            "TypeScript",
            "Node.js",
            "React.js",
            "Angular",
            "Vue.js",
            "Python",
            "Django",
            "Flask",
            "Ruby on Rails",
            "PHP",
            "Laravel",
            "Java",
            "Spring Boot",
            "C#",
            ".NET Core",
            "Go",
            "Kotlin",
            "SQL",
            "NoSQL",
            "MongoDB",
            "PostgreSQL",
            "MySQL",
            "Docker",
            "Kubernetes",
            "AWS",
            "Azure",
            "Google Cloud Platform",
            "Git",
            "CI/CD",
            "Jenkins",
            "Terraform",
            "Linux",
            "Bash",
            "GraphQL",
            "REST APIs",
            "Unit Testing",
            "Integration Testing",
            "Agile Methodologies",
            "Scrum",
            "Kanban",
        ];      
        
        const seleccionadasTrimmed = seleccionadas.map(skill => skill.trim());
        let html = '';
        skills.forEach(skill =>{
            const trimmedSkill = skill.trim();
            html += `
            <li ${seleccionadasTrimmed.includes(trimmedSkill) ? 'class="activo"' : ''}>${skill}</li>`;
        })
        return opciones.fn().html=html;
    },

    seleccionarSoftSkills : (seleccionadas=[], opciones) => {
        const skills = [
            // Habilidades blandas
            "Communication",
            "Team Collaboration",
            "Problem-Solving",
            "Adaptability",
            "Time Management",
            "Critical Thinking",
        ];

        const seleccionadasTrimmed = seleccionadas.map(skill => skill.trim());
        let html = '';
        skills.forEach(skill =>{
            const trimmedSkill = skill.trim();
            html += `
            <li ${seleccionadasTrimmed.includes(trimmedSkill) ? 'class="activo"' : ''}>${skill}</li>`;
        })
        return opciones.fn().html=html;
    },

    seleccionarUxUiSkills : (seleccionadas=[], opciones) => {
        const skills = [
            // Diseño y UX/UI
            "Figma",
            "Adobe XD",
            "Sketch",
            "Responsive Design",
            "Accessibility",
        ];

        const seleccionadasTrimmed = seleccionadas.map(skill => skill.trim());
        let html = '';
        skills.forEach(skill =>{
            const trimmedSkill = skill.trim();
            html += `
            <li ${seleccionadasTrimmed.includes(trimmedSkill) ? 'class="activo"' : ''}>${skill}</li>`;
        })
        return opciones.fn().html=html;
    },

    seleccionarTools : (seleccionadas=[], opciones) => {
        const skills = [ 
            // Otras herramientas
            "Canva",
            "Photoshop",
            "Filmora",
            "VegasPro",
            "Office",
            "Excel",
            "Illustrator",
        ];

        const seleccionadasTrimmed = seleccionadas.map(skill => skill.trim());
        let html = '';
        skills.forEach(skill =>{
            const trimmedSkill = skill.trim();
            html += `
            <li ${seleccionadasTrimmed.includes(trimmedSkill) ? 'class="activo"' : ''}>${skill}</li>`;
        })
        return opciones.fn().html=html;
    },

    seleccionarIdioma : (seleccionadas=[], opciones) => {
        const skills = [
            // Idiomas
            "English",
            "Spanish",
            "French",
            "German",
            "Chinese",
            "Japanese",
            "Portuguese",
            "Italian",
            "Russian",
            "Arabic",
        ];

        const seleccionadasTrimmed = seleccionadas.map(skill => skill.trim());
        let html = '';
        skills.forEach(skill =>{
            const trimmedSkill = skill.trim();
            html += `
            <li ${seleccionadasTrimmed.includes(trimmedSkill) ? 'class="activo"' : ''}>${skill}</li>`;
        })
        return opciones.fn().html=html;
    },

    // Type of Contract helper
    tipoContrato: (seleccionado,opciones) =>{
        return opciones.fn(this).replace(
            new RegExp(`value="${seleccionado}"`), '$& selected="selected"'
        ) // $& inserts an string
    },

    mostrarAlertas: (errores = {}, alertas) => {
        const categoria = Object.keys(errores);

        let html = ''
        if(categoria.length){
            errores[categoria].forEach(error => {
                html += `<div class="${categoria} alerta"> ${error} </div>`;
            })
        }
        return (alertas.fn().html = html);
    }
    
}