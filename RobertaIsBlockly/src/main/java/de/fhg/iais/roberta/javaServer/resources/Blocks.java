package de.fhg.iais.roberta.javaServer.resources;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Path("/blocks")
public class Blocks {
    private static final Logger LOG = LoggerFactory.getLogger(Blocks.class);
    private static final Map<String, String> programs = new ConcurrentHashMap<>();
    private static final Map<String, String> templates = new ConcurrentHashMap<>();

    static {
        String eins = "" //
            + "<xml id='toolbox' style='display: none'>" //
            + "  <category name='Aktion'>" //
            + "    <block type='robActions_motorDiff_on'>" //
            + "      <value name='POWER'>" //
            + "        <block type='math_number'>" //
            + "          <field name='NUM'>30</field>" //
            + "        </block>" //
            + "      </value>" //
            + "    </block>" //
            + "    <block type='robActions_motorDiff_on_for'>" //
            + "      <value name='POWER'>" //
            + "        <block type='math_number'>" //
            + "          <field name='NUM'>30</field>" //
            + "        </block>" //
            + "      </value>" //
            + "      <value name='DISTANCE'>" //
            + "        <block type='math_number'>" //
            + "          <field name='NUM'>10</field>" //
            + "        </block>" //
            + "      </value>" //
            + "    </block>" //
            + "    <block type='robActions_motorDiff_stop'></block>" //
            + "    <block type='robActions_motorDiff_turn'>" //
            + "      <value name='POWER'>" //
            + "        <block type='math_number'>" //
            + "          <field name='NUM'>30</field>" //
            + "        </block>" //
            + "      </value>" //
            + "    </block>" //
            + "    <block type='robActions_motorDiff_turn_for'>" //
            + "      <value name='POWER'>" //
            + "        <block type='math_number'>" //
            + "          <field name='NUM'>30</field>" //
            + "        </block>" //
            + "      </value>" //
            + "      <value name='DISTANCE'>" //
            + "        <block type='math_number'>" //
            + "          <field name='NUM'>10</field>" //
            + "        </block>" //
            + "      </value>" //
            + "    </block>" //
            + "    <block type='robActions_display'>" //
            + "      <value name='OUT'>" //
            + "        <block type='text'>" //
            + "          <field name='TEXT'>Hallo</field>" //
            + "        </block>" //
            + "      </value>" //
            + "      <value name='COL'>" //
            + "        <block type='math_number'>" //
            + "          <field name='NUM'>0</field>" //
            + "        </block>" //
            + "      </value>" //
            + "      <value name='ROW'>" //
            + "        <block type='math_number'>" //
            + "          <field name='NUM'>0</field>" //
            + "        </block>" //
            + "      </value>" //
            + "    </block>" //
            + "    <block type='robActions_playTone'>" //
            + "      <value name='FREQUENZ'>" //
            + "        <block type='math_number'>" //
            + "          <field name='NUM'>300</field>" //
            + "        </block>" //
            + "      </value>" //
            + "      <value name='DURATION'>" //
            + "        <block type='math_number'>" //
            + "          <field name='NUM'>100</field>" //
            + "        </block>" //
            + "      </value>" //
            + "    </block>" //
            + "    <block type='robActions_brickLight'></block>" //
            + "  </category>" //
            + "  <category name='Kontrolle'>" //
            + "    <block type='robControls_wait'>" //
            + "      <value name='VALUE'>" //
            + "        <block type='math_number'>" //
            + "          <field name='NUM'>25</field>" //
            + "        </block>" //
            + "      </value>" //
            + "    </block>" //
            + "    <block type='robControls_loopUntil'>" //
            + "      <value name='VALUE'>" //
            + "        <block type='math_number'>" //
            + "          <field name='NUM'>25</field>" //
            + "        </block>" //
            + "      </value>" //
            + "    </block>" //
            + "    <block type='robControls_ifElse'>" //
            + "      <value name='VALUE'>" //
            + "        <block type='math_number'>" //
            + "          <field name='NUM'>25</field>" //
            + "        </block>" //
            + "      </value>" //
            + "    </block>" //
            + "  </category>" //
            + "  <category name='Sensoren'>" //
            + "    <block type='robSensors_ultrasonic'>" //
            + "    </block>" //
            + "    <block type='robSensors_touch'>" //
            + "    </block>" //
            + "    <block type='robSensors_colour'>" //
            + "    </block>" //
            + "  </category>" //
            + "</xml>";
        String zwei = "" //
            + "<xml>" //
            + "  <block type='controls_if'></block>" //
            + "  <block type='logic_compare'></block>" //
            + "  <block type='math_number'></block>" //
            + "  <block type='math_arithmetic'></block>" //
            + "  <block type='text'></block>" //
            + "</xml>";
        templates.put("1", eins);
        templates.put("2", zwei);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response workWithBlocks(JSONObject fullRequest) throws Exception {
        LOG.info("/blocks got: " + fullRequest);
        JSONObject response = new JSONObject();
        try {
            JSONObject request = fullRequest.getJSONObject("data");
            String cmd = request.getString("cmd");
            response.put("cmd", cmd);
            if ( cmd.equals("saveP") ) {
                String name = request.getString("name");
                String program = request.getString("program");
                programs.put(name, program);
                System.out.println(programs.get(name));
                response.put("rc", "ok");
            } else if ( cmd.equals("loadP") ) {
                String name = request.getString("name");
                String program = programs.get(name);
                if ( program == null ) {
                    response.put("rc", "error");
                    response.put("cause", "program not found");
                } else {
                    response.put("rc", "ok");
                    response.put("data", program);
                }
            } else if ( cmd.equals("loadT") ) {
                String name = request.getString("name");
                String template = templates.get(name);
                if ( template == null ) {
                    response.put("rc", "error");
                    response.put("cause", "program not found");
                } else {
                    response.put("rc", "ok");
                    response.put("data", template);
                }
            } else {
                response.put("rc", "error");
                response.put("cause", "invalid command");
            }
        } catch ( Exception e ) {
            LOG.error("/blocks exception", e);
            response.put("rc", "error");
            String msg = e.getMessage();
            response.put("cause", msg == null ? "no message" : msg);
        }
        response.put("serverTime", new Date());
        return Response.ok(response).build();
    }

}