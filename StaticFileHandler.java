package genediff.server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


public class StaticFileHandler implements HttpHandler {

    private final Path webRoot;

    public StaticFileHandler() {
        this.webRoot = Paths.get("webapp").toAbsolutePath();
        System.out.println("Serving static files from: " + webRoot);
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {

        String uriPath = exchange.getRequestURI().getPath();

        if ("/".equals(uriPath) || uriPath.isEmpty()) {
            uriPath = "/index.html";
        }

        Path filePath = webRoot.resolve(uriPath.substring(1)).normalize();
        if (!filePath.startsWith(webRoot)) {
            send(exchange, 403, "text/plain", "Forbidden".getBytes());
            return;
        }

        if (!Files.exists(filePath) || Files.isDirectory(filePath)) {
            send(exchange, 404, "text/plain", "Not found".getBytes());
            return;
        }

        byte[] content = Files.readAllBytes(filePath);
        String mimeType = getMimeType(filePath.toString());
        send(exchange, 200, mimeType, content);
    }

    private void send(HttpExchange exchange, int status, String mimeType, byte[] body)
            throws IOException {
        exchange.getResponseHeaders().add("Content-Type", mimeType);
        exchange.sendResponseHeaders(status, body.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(body);
        }
    }

    private String getMimeType(String path) {
        if (path.endsWith(".html")) return "text/html; charset=UTF-8";
        if (path.endsWith(".css"))  return "text/css; charset=UTF-8";
        if (path.endsWith(".js"))   return "application/javascript; charset=UTF-8";
        if (path.endsWith(".jsx"))  return "application/javascript; charset=UTF-8";
        if (path.endsWith(".json")) return "application/json; charset=UTF-8";
        if (path.endsWith(".png"))  return "image/png";
        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
        if (path.endsWith(".ico"))  return "image/x-icon";
        return "application/octet-stream";
    }
}
