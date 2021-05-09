(() => {
    const url = window.location.href;
    let postulateUrl = `https://postulate.us/quick?url=${encodeURIComponent(url)}&isExtension=true`;
    const selection = window.getSelection();
    if (!selection.isCollapsed) {
        const selectionString = selection.toString();
        postulateUrl += `&text=${encodeURIComponent(selectionString)}`;
    }
    window.open(postulateUrl, "_blank");
})();
