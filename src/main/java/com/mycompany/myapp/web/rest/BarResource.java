package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Bar;
import com.mycompany.myapp.repository.BarRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Bar}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BarResource {

    private final Logger log = LoggerFactory.getLogger(BarResource.class);

    private static final String ENTITY_NAME = "enCypressBar";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BarRepository barRepository;

    public BarResource(BarRepository barRepository) {
        this.barRepository = barRepository;
    }

    /**
     * {@code POST  /bars} : Create a new bar.
     *
     * @param bar the bar to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bar, or with status {@code 400 (Bad Request)} if the bar has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bars")
    public ResponseEntity<Bar> createBar(@RequestBody Bar bar) throws URISyntaxException {
        log.debug("REST request to save Bar : {}", bar);
        if (bar.getId() != null) {
            throw new BadRequestAlertException("A new bar cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bar result = barRepository.save(bar);
        return ResponseEntity.created(new URI("/api/bars/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bars} : Updates an existing bar.
     *
     * @param bar the bar to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bar,
     * or with status {@code 400 (Bad Request)} if the bar is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bar couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bars")
    public ResponseEntity<Bar> updateBar(@RequestBody Bar bar) throws URISyntaxException {
        log.debug("REST request to update Bar : {}", bar);
        if (bar.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Bar result = barRepository.save(bar);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bar.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /bars} : get all the bars.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bars in body.
     */
    @GetMapping("/bars")
    public List<Bar> getAllBars() {
        log.debug("REST request to get all Bars");
        return barRepository.findAll();
    }

    /**
     * {@code GET  /bars/:id} : get the "id" bar.
     *
     * @param id the id of the bar to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bar, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bars/{id}")
    public ResponseEntity<Bar> getBar(@PathVariable Long id) {
        log.debug("REST request to get Bar : {}", id);
        Optional<Bar> bar = barRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bar);
    }

    /**
     * {@code DELETE  /bars/:id} : delete the "id" bar.
     *
     * @param id the id of the bar to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bars/{id}")
    public ResponseEntity<Void> deleteBar(@PathVariable Long id) {
        log.debug("REST request to delete Bar : {}", id);

        barRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
