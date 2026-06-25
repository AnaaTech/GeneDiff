package genediff;

import com.sun.net.httpserver.HttpServer;
import genediff.server.AnalyzeHandler;
import genediff.server.DiseasesHandler;
import genediff.server.StaticFileHandler;

import java.net.InetSocketAddress;
import java.util.concurrent.Executors;


 
public class Main {

    private static final int PORT = 8080;

    public static void main(String[] args) throws Exception {

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        server.createContext("/api/analyze", new AnalyzeHandler());

        server.createContext("/api/diseases", new DiseasesHandler());

        server.createContext("/", new StaticFileHandler());

        server.setExecutor(Executors.newFixedThreadPool(4));

        server.start();

        System.out.println("╔══════════════════════════════════════════╗");
        System.out.println("║   GeneDiff Server Started                ║");
        System.out.println("║   http://localhost:" + PORT + "               ║");
        System.out.println("║   Press Ctrl+C to stop                   ║");
        System.out.println("╚══════════════════════════════════════════╝");
    }
}
