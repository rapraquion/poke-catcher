$(document).ready(function() {
  const pokeapiURL = "https://pokeapi.co/api/v2/";

  const regId = $("#region");
  const locId = $("#location");
  const areaId = $("#area");
  const exploreBtn = $("#explore-btn");
  var capturedCounter = 0;
  var areaVal;

  const fetchLocation = path => {
    return fetch(`${pokeapiURL}${path}`)
      .then(res => res.json())
      .then(function(allRes) {
        var allResValue = allRes.results;

        if (path === "region") {
          $(regId).append("<option>- select region -</option>");
          for (let x in allResValue) {
            $(regId).append(`
                <option value="${allResValue[x].url}">${allResValue[x].name}</option>`);
          }
        }

        // sort
        regId.on("change", function() {
          locationURL = this.value;
          $(locId).html("");
          $(areaId).html("");
          return fetch(locationURL)
            .then(res => res.json())
            .then(function(locRes) {
              locValue = locRes.locations;
              $(locId).append("<option>- select location -</option>");
              for (let x in locValue) {
                $(locId).append(
                  `<option value="${locValue[x].url}">${locValue[x].name}</option>`
                );
              }
            });
        });

        locId.on("change", function() {
          areaURL = this.value;
          areaId.html("");
          return fetch(areaURL)
            .then(res => res.json())
            .then(function(areaRes) {
              areaVal = areaRes.areas;
              if (areaVal) {
                $(areaId).append(
                  '<option value="no-selected">- select area -</option>'
                );
                for (let x in areaVal) {
                  $(areaId).append(
                    `<option value="${areaVal[x].url}">${areaVal[x].name}</option>`
                  );
                }
              }
              if (areaId.text().length <= 15) {
                exploreBtn.text("No pokemon in the area");
              }
              if (areaId.val() === "no-selected") {
                exploreBtn.attr("disabled", true);
              } else {
                exploreBtn.removeAttr("disabled");
              }
            });
        });

        areaId.on("change", function() {
          locAreaUrl = this.value;
          if (areaId.val() === "no-selected") {
            exploreBtn.attr("disabled", true);
          } else {
            exploreBtn.removeAttr("disabled");
          }
        });

        //pokemon data
        var pokeName;
        var pokePics;

        exploreBtn.on("click", function() {
          if (capturedCounter >= 6) {
            $("#catch-btn").attr("disabled", true);
            $(".catch-btn").text("POKEDEX FULL");
            $("#catch-btn").css({
              cursor: "not-allowed"
            });
          }
          fetch(locAreaUrl)
            .then(res => res.json())
            .then(function(allPoke) {
              encounter = allPoke.pokemon_encounters;
              var randomNum = Math.floor(Math.random() * encounter.length);
              pokeName = encounter[randomNum].pokemon.name;
              pokeUrl = encounter[randomNum].pokemon.url;

              if (pokeUrl) {
                fetch(pokeUrl)
                  .then(res => res.json())
                  .then(function(details) {
                    $("#founded-text").text(pokeName);
                    pokePics = details.sprites.front_default;
                    $("#poke-image").attr("src", pokePics);
                    $("#speed").text(details.stats[0].base_stat);
                    $("#sp-defense").text(details.stats[1].base_stat);
                    $("#sp-attack").text(details.stats[2].base_stat);
                    $("#defense").text(details.stats[3].base_stat);
                    $("#attack").text(details.stats[4].base_stat);
                    $("#hp").text(details.stats[5].base_stat);
                  });
              }
            });
        });

        // captured pokemon
        $("#catch-btn").on("click", function() {
          if (capturedCounter <= 6) {
            $(".found-cont").addClass("hide");
            $(".found-cont-captured").removeClass("hide");
            $(".capture-text").text(`you've captured ${pokeName}!`);
            $(".capture-text").append(
              `<br><span class='capture-subtext'>click <span class="text-red">explore</span> to find more<span>`
            );

            $(".captured-box").append(`
        <div class="captured-poke">
        <img src="${pokePics}" alt="" width="200px" height="200px" class="img-captured">
        <span class="founded-text" id="founded-text">${pokeName}</span>
        </div>
        `);

            capturedCounter++;
            $(".cap-countered").text(`${capturedCounter}/6`);
          }

          // exploreBtn.attr('disabled', true)
        });
      });
  };

  fetchLocation("region");
});