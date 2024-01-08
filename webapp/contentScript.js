async function query(data) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/elftsdmr/malware-url-detect",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
      console.error("Error querying the model:", error);
      //window.alert(error);
    return { error: "Error querying the model" };
  }
}

// Function to check if the URL is potentially malicious
async function checkMalicious() {
  let currentURL = window.location.href;

  try {
    const response = await query({ inputs: currentURL });

    let isMalicious = false;
    if (response[0][0].label === "MALWARE") {
      isMalicious = true;
      // Inform the user or take action for malicious URL
      window.alert("This URL might be malicious. Proceed with caution.");
      // You might block the navigation or redirect the user
      // window.location.href = "safe-page.html";
    }

    let hasThirdPartyCookies = false;
    if (
      document.cookie
        .split(";")
        .some(
          (cookie) =>
            cookie.trim().startsWith("_") ||
            cookie.trim().startsWith("third-party-cookie")
        )
    ) {
      hasThirdPartyCookies = true;
      window.alert(
        "This site is using third-party cookies. Consider adjusting your browser settings."
      );
    }

    // Store the detection results in local storage
    localStorage.setItem(
      "urlDetectionResult",
      JSON.stringify({
        url: currentURL,
        isMalicious: isMalicious,
        hasThirdPartyCookies: hasThirdPartyCookies,
      })
      );
      window.alert(localStorage.getItem("urlDetectionResult"))
  } catch (error) {
    console.log("Error checking URL:", error);
  }
}

// Listen for changes in the browser's URL bar
window.addEventListener("hashchange", checkMalicious);
window.addEventListener("popstate", checkMalicious);
window.addEventListener("load", checkMalicious);
