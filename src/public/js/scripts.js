function giveLike(event) {
  console.log("Liking");
  // console.log("el. clickeado: ", event);
  let mainDiv = event.parentNode;
  // console.log('count section: ', mainDiv.childNodes[5])
  // console.log("EMPTY HEARTH: ", event.childNodes[1])
  // console.log("FULL HEARTH", mainDiv.childNodes[1].childNodes[1])
  let count = mainDiv.childNodes[5]; // Likes counter
  let emptyHearth = event.childNodes[1]; // Capture empty hearth
  let fullHearth = mainDiv.childNodes[1].childNodes[1]; // Capture full hearth
  let image_id = event.getAttribute("data-id"); // Capture image-id (like reference)
  // Like
  count.innerHTML = "";
  emptyHearth.classList.add("d-none");
  fullHearth.classList.remove("d-none");
  // console.log(event.getAttribute("data-id"));
  fetch(`/images/${image_id}/like`, {
    method: "POST",
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => {
      console.log("success like: ", response);
      count.innerHTML = response.likes;
    });
}
// Dislike
function disLike(event) {
  console.log("Disliking");
  // console.log("el. clickeado: ", event);
  let mainDiv = event.parentNode;
  // console.log("IMAGEN ID");
  // console.log('count section: ', mainDiv.childNodes[5])
  // console.log("EMPTY HEARTH: ", mainDiv.childNodes[3].childNodes[1])
  // console.log("FULL HEARTH", mainDiv.childNodes[1].childNodes[1])
  let likes = mainDiv; // Likes container
  let count = mainDiv.childNodes[5]; // Likes counter
  let emptyHearth = mainDiv.childNodes[3].childNodes[1]; // Capture empty hearth
  let fullHearth = mainDiv.childNodes[1].childNodes[1]; // Capture full hearth
  let image_id = event.getAttribute("data-id"); // Capture image-id (like reference)
  // console.log("image_id: ", event.getAttribute("data-id"));
  // dislike
  count.innerHTML = "";
  fullHearth.classList.add("d-none");
  emptyHearth.classList.remove("d-none");
  // console.log(likes.getAttribute("data-id"));
  fetch(`/images/${image_id}/dislike`, {
    method: "POST",
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => {
      console.log("success dislike", response);
      count.innerHTML = response.likes;
    });
}

// Delete action
/* const iconTrash = document.getElementById("iconTrash");
iconTrash.addEventListener("click", (event) => {
  let image_id = event.target.getAttribute("data-id"); // Capture image-id (click reference)
  console.log("trash");
  fetch(`/images/${image_id}/delete`, {
    method: "POST",
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => {
      console.log("success deleted: ", response);
    });
});
 */
