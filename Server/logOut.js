exports.logout = (req, res) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none", // or "lax" depending on your use case
            path: "/"
        });
        console.log("cookies cleared");
        res.status(200).json({ msg: "loggedout" });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}