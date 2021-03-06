package de.fhg.iais.roberta.mode.sensor;

import de.fhg.iais.roberta.inter.mode.sensor.ILightSensorMode;

public enum LightSensorMode implements ILightSensorMode {
    DEFAULT, RED( "light" ), AMBIENTLIGHT( "Ambient" ), LEFT( "Left" ), RIGHT( "Right" ), LIGHT_VALUE(), VALUE();

    private final String[] values;

    private LightSensorMode(String... values) {
        this.values = values;
    }

    @Override
    public String[] getValues() {
        return this.values;
    }

}
