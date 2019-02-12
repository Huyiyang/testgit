<%@ Page Language="C#" %>

<script runat="server">
    protected override void OnLoad(EventArgs e)
    {
        string pp = Request.Browser.Browser.ToLower();
        writefile("~/ccprint-setup.exe");
    }

    private void writefile(string path)
    {
        System.IO.FileInfo fi = new System.IO.FileInfo(Request.MapPath(path));

        Response.Clear();
        Response.ClearContent();
        Response.ClearHeaders();
        Response.AddHeader("Content-Disposition", "attachment;filename=" + fi.Name);
        Response.ContentType = "application/" + fi.Extension;
        Response.ContentEncoding = System.Text.Encoding.GetEncoding("gb2312");
        Response.WriteFile(fi.FullName);
        Response.Flush();
        Response.End();
    }
</script>
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body></body>
</html>
