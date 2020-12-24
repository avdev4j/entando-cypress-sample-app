package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.EnCypressApp;
import com.mycompany.myapp.config.TestSecurityConfiguration;
import com.mycompany.myapp.domain.Bar;
import com.mycompany.myapp.repository.BarRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link BarResource} REST controller.
 */
@SpringBootTest(classes = { EnCypressApp.class, TestSecurityConfiguration.class })
@AutoConfigureMockMvc
@WithMockUser
public class BarResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private BarRepository barRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBarMockMvc;

    private Bar bar;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bar createEntity(EntityManager em) {
        Bar bar = new Bar()
            .name(DEFAULT_NAME);
        return bar;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bar createUpdatedEntity(EntityManager em) {
        Bar bar = new Bar()
            .name(UPDATED_NAME);
        return bar;
    }

    @BeforeEach
    public void initTest() {
        bar = createEntity(em);
    }

    @Test
    @Transactional
    public void createBar() throws Exception {
        int databaseSizeBeforeCreate = barRepository.findAll().size();
        // Create the Bar
        restBarMockMvc.perform(post("/api/bars").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bar)))
            .andExpect(status().isCreated());

        // Validate the Bar in the database
        List<Bar> barList = barRepository.findAll();
        assertThat(barList).hasSize(databaseSizeBeforeCreate + 1);
        Bar testBar = barList.get(barList.size() - 1);
        assertThat(testBar.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createBarWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = barRepository.findAll().size();

        // Create the Bar with an existing ID
        bar.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBarMockMvc.perform(post("/api/bars").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bar)))
            .andExpect(status().isBadRequest());

        // Validate the Bar in the database
        List<Bar> barList = barRepository.findAll();
        assertThat(barList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllBars() throws Exception {
        // Initialize the database
        barRepository.saveAndFlush(bar);

        // Get all the barList
        restBarMockMvc.perform(get("/api/bars?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bar.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }
    
    @Test
    @Transactional
    public void getBar() throws Exception {
        // Initialize the database
        barRepository.saveAndFlush(bar);

        // Get the bar
        restBarMockMvc.perform(get("/api/bars/{id}", bar.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bar.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }
    @Test
    @Transactional
    public void getNonExistingBar() throws Exception {
        // Get the bar
        restBarMockMvc.perform(get("/api/bars/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBar() throws Exception {
        // Initialize the database
        barRepository.saveAndFlush(bar);

        int databaseSizeBeforeUpdate = barRepository.findAll().size();

        // Update the bar
        Bar updatedBar = barRepository.findById(bar.getId()).get();
        // Disconnect from session so that the updates on updatedBar are not directly saved in db
        em.detach(updatedBar);
        updatedBar
            .name(UPDATED_NAME);

        restBarMockMvc.perform(put("/api/bars").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedBar)))
            .andExpect(status().isOk());

        // Validate the Bar in the database
        List<Bar> barList = barRepository.findAll();
        assertThat(barList).hasSize(databaseSizeBeforeUpdate);
        Bar testBar = barList.get(barList.size() - 1);
        assertThat(testBar.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingBar() throws Exception {
        int databaseSizeBeforeUpdate = barRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBarMockMvc.perform(put("/api/bars").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bar)))
            .andExpect(status().isBadRequest());

        // Validate the Bar in the database
        List<Bar> barList = barRepository.findAll();
        assertThat(barList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBar() throws Exception {
        // Initialize the database
        barRepository.saveAndFlush(bar);

        int databaseSizeBeforeDelete = barRepository.findAll().size();

        // Delete the bar
        restBarMockMvc.perform(delete("/api/bars/{id}", bar.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bar> barList = barRepository.findAll();
        assertThat(barList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
