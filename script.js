function generate() {
  document.getElementById("r-name").innerText =
    document.getElementById("name").value;

  document.getElementById("r-title").innerText =
    document.getElementById("title").value;

  document.getElementById("r-phone").innerText =
    document.getElementById("phone").value;

  document.getElementById("r-email").innerText =
    document.getElementById("email").value;

  document.getElementById("r-address").innerText =
    document.getElementById("address").value;

  document.getElementById("r-profile").innerText =
    document.getElementById("profile").value;

  document.getElementById("r-education").innerText =
    document.getElementById("education").value;

  document.getElementById("r-experience").innerText =
    document.getElementById("experience").value;

  // Skills list
  let skillsValue = document.getElementById("skills").value;
  let skillsList = skillsValue.split(",");

  let ul = document.getElementById("r-skills");
  ul.innerHTML = "";

  skillsList.forEach(skill => {
    let li = document.createElement("li");
    li.innerText = skill.trim();
    ul.appendChild(li);
  });
}

  // Skills as list
  let skillsList = skills.value.split(",");
  let ul = document.getElementById("r-skills");
  ul.innerHTML = "";

  skillsList.forEach(skill => {
    let li = document.createElement("li");
    li.innerText = skill.trim();
    ul.appendChild(li);
  });


async function downloadPDF() {
  const { jsPDF } = window.jspdf;

  const resume = document.getElementById("resume");

  const canvas = await html2canvas(resume, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save("resume.pdf");
}