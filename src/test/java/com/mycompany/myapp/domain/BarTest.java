package com.mycompany.myapp.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.mycompany.myapp.web.rest.TestUtil;

public class BarTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bar.class);
        Bar bar1 = new Bar();
        bar1.setId(1L);
        Bar bar2 = new Bar();
        bar2.setId(bar1.getId());
        assertThat(bar1).isEqualTo(bar2);
        bar2.setId(2L);
        assertThat(bar1).isNotEqualTo(bar2);
        bar1.setId(null);
        assertThat(bar1).isNotEqualTo(bar2);
    }
}
