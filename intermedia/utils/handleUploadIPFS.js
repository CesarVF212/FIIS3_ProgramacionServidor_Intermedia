const uploadToPinata = async (fileBuffer, filename) => {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    let data = new FormData();
    const blob = new Blob([fileBuffer])
    data.append("file", blob, filename);

    const metadata = JSON.stringify({
        name: filename,
    });

    data.append("pinataMetadata", metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });

    data.append("pinataOptions", options);  

    try{
        const response = await fetch(url, {
            method: "POST",
            body: data,
            headers: {
                'pintata_api_key': process.env.PINATA_API_KEY,
                'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
            }
        });

        if(!response.ok) {
            throw new Error("Error uploading to Pinata");
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
        throw error;
    }
};