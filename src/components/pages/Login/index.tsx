import { MobileFriendly } from '@mui/icons-material';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/system';
import Button from 'components/atoms/Button';
import Checkbox from 'components/atoms/Checkbox';
import Divider from 'components/atoms/Divider';
import FieldForm from 'components/atoms/fields/FieldForm';
import FormControlLabel from 'components/atoms/FormControlLabel';
import IconButton from 'components/atoms/IconButton';
import Icon from 'components/atoms/Icon';
import FormGroup from 'components/atoms/FormGroup';
import Grid from 'components/atoms/Grid';
import Hidden from 'components/atoms/Hidden';
import Typography from 'components/atoms/Typography';
import { __ } from 'helpers/i18n';
import { addScript } from 'helpers/script';
import { themes } from 'helpers/theme';
import useAjax from 'hook/useApi';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import settingService from 'services/settingService';
import { updateAccessToken } from 'store/user/user.reducers';
import { changeMode } from 'store/theme/theme.reducers';

const useStyles = makeStyles(({ breakpoints }: Theme) => ({
    root: {
        minHeight: '100vh',
    },
    mid: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    colLeft: {
        minHeight: '100vh',
        color: 'white',
    },
    colRight: {
        minHeight: '100vh',
    },
    contentLeft: {
        maxWidth: 430,
        margin: '0 auto',
        fontSize: 77,
        lineHeight: '77px',
        fontWeight: 'bold',
        textAlign: 'left',
        textShadow: '7px 7px 9px rgba(0, 0, 0, 0.5)'
    },
    form: {
        padding: '20px 60px',
        margin: 0,
        width: 536,
        maxWidth: '100%',
        position: 'initial',
        top: 'auto',
        [breakpoints.down('md')]: {
            padding: '0px 15px',
        },
    },
    googleBtn: {
        width: '100%',
        height: 42,
        backgroundColor: '#4285f4',
        borderRadius: 2,
        boxShadow: '0 3px 4px 0 rgba(0,0,0,.25)',
        display: 'inline-flex',
        cursor: 'pointer',
        position: 'relative',
        '& .google-icon-wrapper': {
            position: 'absolute',
            marginTop: 1,
            marginLeft: 1,
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: '#fff',
        },
        '& .google-icon': {
            position: 'absolute',
            marginTop: 11,
            marginLeft: 11,
            width: 18,
            height: 18
        },
        '& .btn-text': {
            color: '#fff',
            fontSize: 14,
            letterSpacing: '0.2px',
            fontFamily: "Roboto",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 20px',
            width: '100%',
        },
        '&:hover': {
            boxShadow: '0 0 6px #4285f4'
        },
        '&:active': {
            background: '#1669F2'
        }
    },
    orSeperator: {
        marginTop: 10,
        marginBottom: 10,
    },
    viewMode: {
        position: 'fixed',
        top: 8,
        right: 8,
    }
}));

interface SettingsLogin {
    _loaded: boolean,
    template: {
        [key: string]: any,
        admin_template_slogan: any,
        admin_template_color_left: any,
    },
    security: {
        [key: string]: any,
    }
}

function Login() {

    const classes = useStyles();

    const [showVerificationCode, setShowVerificationCode] = React.useState<Boolean>(false);

    const theme: Theme = useTheme();

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const { ajax, Loading } = useAjax();

    const [settings, setSettings]: [SettingsLogin | false, any] = React.useState<SettingsLogin>({
        _loaded: false,
        template: {
            admin_template_slogan: 'do <br /> something<br /><span style="color:#18b797;font-size: 85px;">you love</span><br /> today</>',
            admin_template_color_left: '#582979'
        },
        security: {
            security_active_recaptcha_google: 0
        }
    });

    const [formData, setFormData] = React.useState<{
        username: string,
        password: string,
        _password: string,
        verification_code: string,
        remember_me: 0 | 1,
    }>({
        username: 'dangthuyenquan@gmail.com',
        password: 'dangthuyenquan',
        _password: 'dangthuyenquan',
        verification_code: '',
        remember_me: 0
    })

    React.useEffect(() => {

        if (!settings._loaded) {
            (async () => {

                let config: SettingsLogin = await settingService.getLoginConfig();

                Object.keys(config.template).forEach(key => {
                    if (config.template[key] === '') {
                        config.template[key] = settings.template[key];
                    }
                });

                Object.keys(config.security).forEach(key => {
                    if (config.security[key] === '') {
                        config.security[key] = settings.security[key];
                    }
                });

                setSettings({ ...config, _loaded: true });

            })();
        }

    }, [settings]);

    React.useEffect(() => {
        if (settings._loaded) {

            if (settings.security.security_active_recaptcha_google * 1 === 1) {
                addScript('https://www.google.com/recaptcha/api.js', 'recaptcha', () => {
                    window.capcha_login = window.grecaptcha.render('recaptcha-login', {
                        'sitekey': settings.security.security_recaptcha_sitekey
                    });
                }, 500);
            }


            if (settings.security.security_active_signin_with_google_account) {

                addScript('https://apis.google.com/js/platform.js', 'apis_google_com_platform', () => {

                    window.gapi.load('auth2', function () {
                        let auth2 = window.gapi.auth2.init({
                            client_id: settings.security.security_google_oauth_client_id,
                            cookiepolicy: 'single_host_origin',
                            scope: 'email'
                        });

                        let element = document.getElementById('googleSignIn');

                        auth2.attachClickHandler(element, {},
                            function (googleUser: any) {

                                handleEmailResponse(
                                    { loginByEmail: googleUser.getAuthResponse().access_token }
                                );

                            }, function (error: any) {

                                enqueueSnackbar({
                                    content: 'Sign-in error:' + error.error,
                                    options: { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'left' } }
                                });

                            }
                        );
                    });

                }, 500);
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);

    const handleEmailResponse = (data: {}) => {
        ajax({
            url: 'login/check',
            method: 'POST',
            data: data,
            success: (result: {
                requiredVerificationCode?: boolean,
                access_token?: string
            }) => {
                if (result.requiredVerificationCode) {
                    setShowVerificationCode(true);
                } else if (result.access_token) {
                    dispatch(updateAccessToken(result.access_token));
                }

                if (window.grecaptcha) {
                    window.grecaptcha.reset(window.capcha_login);
                }
            }
        });
    }


    const handleUpdateViewMode = (mode: string) => () => {
        dispatch(changeMode(mode));
    }

    const onClickLogin = () => {
        let data = {
            ...formData,
            showVerificationCode: showVerificationCode,
            'g-recaptcha-response': null,
        };

        if (settings.security.security_active_recaptcha_google * 1 === 1 && window.grecaptcha) {

            let recaptcha = window.grecaptcha.getResponse(window.capcha_login);

            if (!recaptcha) {

                enqueueSnackbar({
                    content: 'The g-recaptcha-response field is required.',
                    options: { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'left' } }
                });
                return;
            }

            data['g-recaptcha-response'] = recaptcha;
        }

        handleEmailResponse(data);
    };

    if (!settings._loaded) {
        return null;
    }

    return (
        <>
            <Helmet>
                <title>{__('Login')}</title>
            </Helmet>
            <Grid container className={classes.root} spacing={0}>

                <Hidden smDown>
                    <Grid item md={8} className={classes.mid + ' ' + classes.colLeft} style={{ background: settings.template.admin_template_color_left }}>
                        <p className={classes.contentLeft} dangerouslySetInnerHTML={{
                            __html: settings.template.admin_template_slogan
                        }} >
                        </p>
                    </Grid>
                </Hidden>

                <Grid item xs={12} md={4} className={classes.mid + ' ' + classes.colRight}>
                    <div className={classes.form}>
                        <Typography
                            component="h1"
                            style={{
                                fontWeight: 'bold',
                                fontSize: 24
                            }}
                            gutterBottom
                            dangerouslySetInnerHTML={{ __html: settings.template && settings.template['admin_template_headline-right'] ? settings.template['admin_template_headline-right'] : __('Sign in') }} />
                        {
                            !showVerificationCode &&
                            <div style={{ marginTop: 24 }}>
                                <div style={{ marginTop: 24 }}>
                                    <FieldForm
                                        component={'text'}
                                        config={{
                                            title: __('Email or phone number')
                                        }}
                                        required
                                        post={formData}
                                        name={'username'}
                                        onReview={value => { setFormData(prev => ({ ...prev, username: value })) }}
                                    />
                                </div>
                                <div style={{ marginTop: 24 }}>
                                    <FieldForm
                                        component={'password'}
                                        config={{
                                            title: __('Enter your password'),
                                            generator: false
                                        }}
                                        post={formData}
                                        name={'password'}
                                        onReview={value => { setFormData(prev => ({ ...prev, password: value })) }}
                                    />
                                </div>
                            </div>
                        }
                        {
                            showVerificationCode &&
                            <div style={{ marginTop: 42 }}>
                                <Typography variant="h4">{__('2-Step Verification')}</Typography>

                                <Grid container spacing={2} style={{ margin: '10px 0 30px 0' }}>
                                    <Grid item xs={12} md={2}>
                                        <MobileFriendly style={{ fontSize: 65, color: 'rgb(154 154 154)' }} />
                                    </Grid>
                                    <Grid item xs={12} md={7}>
                                        <Typography style={{ fontWeight: 500 }} variant="body1">{__('Enter the verification code generated by your mobile application.')}</Typography>
                                    </Grid>
                                </Grid>

                                <FieldForm
                                    component={'text'}
                                    config={{
                                        title: __('Verification Code'),
                                        generator: false
                                    }}
                                    post={formData}
                                    name={'verification_code'}
                                    onReview={value => { formData.verification_code = value; }}
                                />
                            </div>
                        }
                        {
                            settings.security.security_active_recaptcha_google * 1 === 1 &&
                            <div style={{ marginTop: 24 }}>
                                <div className="recaptcha-login" id="recaptcha-login"></div>
                            </div>
                        }

                        {
                            settings.security.security_enable_remember_me &&
                            <div style={{ marginTop: 24 }}>
                                <FormGroup>
                                    <FormControlLabel
                                        style={{ marginRight: 24 }}
                                        control={<Checkbox
                                            onClick={() => {
                                                if (formData.remember_me) {
                                                    setFormData({ ...formData, remember_me: 0 });
                                                } else {
                                                    setFormData({ ...formData, remember_me: 1 });
                                                }
                                            }} checked={Boolean(formData.remember_me)} color="primary" />}
                                        label={__('Remember Me')}
                                    />
                                </FormGroup>
                            </div>
                        }

                        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button style={{ width: '100%' }} variant="contained" color="primary" disableElevation onClick={onClickLogin}>
                                {__('Sign in')}
                            </Button>
                            {Loading}
                        </div>
                        {
                            Boolean(settings.security.security_active_signin_with_google_account) &&
                            <div>
                                <div className={classes.orSeperator}>
                                    <Divider>{__('OR')}</Divider>
                                </div>
                                <div >
                                    <div id="googleSignIn" className={classes.googleBtn}>
                                        <div className="google-icon-wrapper">
                                            <img className="google-icon" alt="Login With Google Account" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
                                        </div>
                                        <p className="btn-text"><b>{__('Sign in with google')}</b></p>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <IconButton className={classes.viewMode} onClick={handleUpdateViewMode(theme.type === 'light' ? 'dark' : 'light')}>
                        <Icon icon={themes[theme.type]?.icon} />
                    </IconButton>
                </Grid>

            </Grid>
        </>
    )
}

export default Login
