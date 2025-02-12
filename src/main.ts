const input: string = '<input type="file" name="file" id="file">'
const inputFile = document.getElementById("file")
// VIEW
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h3>takiye perogi</h3>
      ${input}
      <form method="post" action="">
      <input type="file" id="image_input" accept="image/jpeg, image/png, image/jpg">
      <input id="modified_image" name="image" type="hidden" value="">
      <input type="submit" value="Upload">
      </form>
  </div>`